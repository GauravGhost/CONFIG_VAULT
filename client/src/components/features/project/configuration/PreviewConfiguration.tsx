import MarkdownViewer from '@/components/editor/MarkdownViewer';
import { Loader } from '@/components/ui/loader';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { usePrivateGetApi, usePrivatePostApi, usePrivatePutApi } from '@/hooks/useApi';
import { useIsMobile } from '@/hooks/use-mobile';
import { endpoints } from '@/lib/endpoints';
import { environmentEnum, type ConfigurationWithDetail, type Environment } from '@config-vault/shared';
import { Editor, type OnMount } from '@monaco-editor/react';
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import SectionWrapper from '@/components/core/wrapper/SectionWrapper';
import { configurationPreviewConfig } from '@/constant/page-config/project-config';
import MyTabs from '@/components/ui/my-tabs/MyTabs';
import type { TabItem } from '@/components/ui/my-tabs/MyTabs';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { colorTheme } from '@/constant/enums';
import Text from '@/components/ui/text';
import EditConfigurationName from './EditConfigurationName';
import MyCombobox from '@/components/ui/my-combobox/MyCombobox';

const ConfigurationActionButton = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <Button
            variant="outline"
            onClick={() => navigate(`/projects/${id}/configuration/create`)}
        >
            <Icon name='Plus' />
        </Button>
    );
};

const PreviewConfiguration = () => {
    const { id } = useParams<{ id: string }>();
    const { data, loading, fetch } = usePrivateGetApi<ConfigurationWithDetail[]>();
    const isMobile = useIsMobile();
    const [activeConfigurationId, setActiveConfigurationId] = useState<string>('');

    const handleRefresh = async () => {
        if (!id) return;
        await fetch(endpoints.configurations.getByIdWithDetails(id));
    }

    useEffect(() => {
        if (id) {
            fetch(endpoints.configurations.getByIdWithDetails(id));
        }
    }, [id, fetch]);

    useEffect(() => {
        if (data && data.length > 0 && !activeConfigurationId && data[0]?.id) {
            setActiveConfigurationId(data[0].id.toString());
        }
    }, [data, activeConfigurationId]);

    const handleEditorDidMount = (editor: Parameters<OnMount>[0]) => {
        editor.focus();
    };

    if (loading) {
        return <Loader fullScreen />
    }

    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-screen">No configurations found</div>;
    }

    const tabs: TabItem[] = data.map((config) => ({
        id: config.id?.toString() || '',
        label: config.name,
        badge: config.configuration_details?.length || 0,
        content: <ConfigurationContent configuration={config} onRefresh={handleRefresh} handleEditorDidMount={handleEditorDidMount} isMobile={isMobile} />
    }));

    return (
        <div className="h-screen w-full flex flex-col">
            <MyTabs
                tabs={tabs}
                activeTab={activeConfigurationId}
                onTabChange={setActiveConfigurationId}
                variant="default"
                className="h-full flex flex-col overflow-hidden"
                tabContentClassName="flex-1 min-h-0 mt-2 overflow-hidden"
            />
        </div>
    )
}

const ConfigurationContent = ({
    configuration,
    handleEditorDidMount,
    isMobile,
    onRefresh
}: {
    configuration: ConfigurationWithDetail;
    handleEditorDidMount: (editor: Parameters<OnMount>[0]) => void;
    isMobile: boolean;
    onRefresh: () => Promise<void>;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>('development');
    const [codeContent, setCodeContent] = useState<string>('');
    const [envContent, setEnvContent] = useState<string>('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { postData, loading: createLoading } = usePrivatePostApi();
    const { putData, loading: updateLoading } = usePrivatePutApi();

    // Find the current environment's configuration detail
    const getCurrentDetail = useCallback(() => {
        return configuration.configuration_details?.find(
            detail => detail.environment === selectedEnvironment
        );
    }, [configuration.configuration_details, selectedEnvironment]);

    // Update content when environment changes
    useEffect(() => {
        const currentDetail = getCurrentDetail();
        if (currentDetail) {
            setCodeContent(currentDetail.code || '');
            setEnvContent(currentDetail.env || '');
        } else {
            // Environment doesn't exist, show empty content
            setCodeContent('');
            setEnvContent('');
        }
        setHasUnsavedChanges(false);
        setIsEditing(false);
    }, [selectedEnvironment, getCurrentDetail]);

    const handleCodeChange = useCallback((value: string | undefined) => {
        setCodeContent(value || '');
        setHasUnsavedChanges(true);
    }, []);

    const handleEnvChange = useCallback((value: string | undefined) => {
        setEnvContent(value || '');
        setHasUnsavedChanges(true);
    }, []);

    const handleSave = useCallback(async () => {
        if (!hasUnsavedChanges) return;

        try {
            const currentDetail = getCurrentDetail();

            if (currentDetail) {
                // Update existing detail
                await putData(endpoints.configurationDetails.update(currentDetail.id!), {
                    code: codeContent,
                    env: envContent,
                    environment: selectedEnvironment
                });
            } else {
                // Create new detail
                await postData(endpoints.configurationDetails.create, {
                    configuration_id: configuration.id!,
                    environment: selectedEnvironment,
                    code: codeContent,
                    env: envContent
                });
            }

            setHasUnsavedChanges(false);
            setIsEditing(false);
            await onRefresh();
        } catch (error) {
            console.error('Failed to save configuration detail:', error);
        }
    }, [hasUnsavedChanges, getCurrentDetail, putData, postData, codeContent, envContent, selectedEnvironment, configuration.id, onRefresh]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleEnvironmentChange = useCallback((value: string | string[]) => {
        if (typeof value === 'string') {
            setSelectedEnvironment(value as Environment);
        }
    }, []);

    const isSaving = createLoading || updateLoading;

    return (
        <div className='h-full w-full flex flex-col overflow-hidden'>
            <div className={cn("p-2 border-1 rounded-t-md flex justify-between items-center flex-shrink-0", colorTheme.gray.mix)}>
                <div className='flex gap-2 items-center'>
                    <Text variant='code'>{configuration.name}</Text>
                    <EditConfigurationName open={isOpen} onRefresh={onRefresh} onOpenChange={setIsOpen} data={configuration} />
                    {hasUnsavedChanges && (
                        <span className="text-yellow-500 text-xs">● Unsaved changes</span>
                    )}
                </div>
                <div className='flex gap-2'>
                    {!isEditing ? (
                        <Button variant="outline" onClick={handleEdit} disabled={isSaving}>
                            <Icon name='Edit' />
                            <span>Edit Content</span>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={handleSave}
                            disabled={!hasUnsavedChanges || isSaving}
                        >
                            <Icon name='Save' />
                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                        </Button>
                    )}
                </div>
            </div>
            <ResizablePanelGroup
                direction={isMobile ? "vertical" : "horizontal"}
                className={cn("flex-1 w-full gap-1 rounded-b-md min-h-0", colorTheme.gray.mix)}
            >
                {/* Content */}
                <ResizablePanel
                    defaultSize={isMobile ? 30 : 50}
                    minSize={isMobile ? 20 : 25}
                    className="flex flex-col min-h-0"
                >
                    <div className="flex-1 p-4 overflow-auto scrollbar-dark">
                        <MarkdownViewer content={configuration?.content ?? ""} />
                    </div>
                </ResizablePanel >

                <ResizableHandle withHandle className="bg-transparent" />

                {/* Code + Output */}
                <ResizablePanel
                    defaultSize={isMobile ? 70 : 50}
                    minSize={isMobile ? 40 : 30}
                    className="flex flex-col min-h-0"
                >
                    <ResizablePanelGroup direction="vertical" className="flex-1 gap-1 min-h-0">

                        {/* Code Editor */}
                        <ResizablePanel defaultSize={60} minSize={40} className="flex flex-col min-h-0">
                            <div className="flex-1 w-full flex flex-col min-h-0">
                                <div className='py-1 px-2 border-1 flex justify-between rounded-ss-md items-center flex-shrink-0'>
                                    <div className='flex items-center gap-4'>
                                        <Text variant="subtitle" className="flex items-center gap-1">
                                            <Icon name='CodeXml' className={cn("h-5 w-5", colorTheme.green.text)} />
                                            Code
                                        </Text>
                                        <MyCombobox
                                            items={environmentEnum.options.map(env => ({ value: env, label: env }))}
                                            value={selectedEnvironment}
                                            variant={"modern"}
                                            triggerIcon='ChevronDown'
                                            className='cursor-pointer'
                                            size={"sm"}
                                            showSearch={false}
                                            onValueChange={handleEnvironmentChange}
                                            placeholder="Select environment"
                                        />
                                    </div>

                                    <div className='flex gap-2'>
                                        <Text variant="p" className="text-muted-foreground text-sm">
                                            {getCurrentDetail() ? 'Existing' : 'New'} configuration
                                        </Text>
                                    </div>
                                </div>
                                <div className="flex-1 min-h-0">
                                    <Editor
                                        height="100%"
                                        width="100%"
                                        language={configuration?.file_type || "txt"}
                                        theme={"vs-dark"}
                                        value={codeContent}
                                        onChange={isEditing ? handleCodeChange : undefined}
                                        onMount={handleEditorDidMount}
                                        options={{
                                            padding: { top: 8, bottom: 8 },
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            roundedSelection: false,
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            wordWrap: 'on',
                                            readOnly: !isEditing,
                                            scrollbar: {
                                                vertical: 'auto',
                                                horizontal: 'auto',
                                                useShadows: false
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle className="bg-transparent" />

                        {/* Env Editor */}
                        <ResizablePanel defaultSize={40} minSize={20} className="flex flex-col min-h-0">
                            <div className="flex-1 w-full flex flex-col min-h-0">
                                <div className='py-2.5 px-2 border-1 flex justify-between items-center rounded-ss-md flex-shrink-0'>
                                    <Text variant="subtitle" className="flex items-center gap-1">
                                        <Icon name='Lock' className={cn("h-5 w-5", colorTheme.red.text)} />
                                        Environment Variable
                                    </Text>
                                </div>
                                <div className="flex-1 min-h-0">
                                    <Editor
                                        height="100%"
                                        width="100%"
                                        language={"properties"}
                                        theme={"vs-dark"}
                                        value={envContent}
                                        onChange={isEditing ? handleEnvChange : undefined}
                                        onMount={handleEditorDidMount}
                                        options={{
                                            padding: { top: 8, bottom: 8 },
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            roundedSelection: false,
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            wordWrap: 'on',
                                            readOnly: !isEditing,
                                            scrollbar: {
                                                vertical: 'auto',
                                                horizontal: 'auto',
                                                useShadows: false
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </ResizablePanel>

                    </ResizablePanelGroup>
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    )
}

export default SectionWrapper(
    "configuration-preview",
    PreviewConfiguration,
    configurationPreviewConfig.breadcrumb,
    <ConfigurationActionButton />,
    {
        contentPadding: "p-2"
    }
)