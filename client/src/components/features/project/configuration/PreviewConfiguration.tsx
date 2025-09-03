import MarkdownViewer from '@/components/editor/MarkdownViewer';
import { Loader } from '@/components/ui/loader';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { usePrivateGetApi, usePrivatePostApi, usePrivatePutApi } from '@/hooks/useApi';
import { useIsMobile } from '@/hooks/use-mobile';
import { endpoints } from '@/lib/endpoints';
import { environmentEnum, fileTypeEnum, type ConfigurationWithDetail, type Environment, type FileType } from '@config-vault/shared';
import { Editor, type OnMount } from '@monaco-editor/react';
import { useCallback, useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router';
import SectionWrapper from '@/components/core/wrapper/SectionWrapper';
import { configurationPreviewConfig } from '@/constant/page-config/project-config';
import MyTabs from '@/components/ui/my-tabs/MyTabs';
import type { TabItem } from '@/components/ui/my-tabs/MyTabs';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn, formatToSentenceCase } from '@/lib/utils';
import { colorTheme } from '@/constant/enums';
import Text from '@/components/ui/text';
import EditConfigurationName from './EditConfigurationName';
import MyCombobox from '@/components/ui/my-combobox/MyCombobox';

const ENVIRONMENTS: Environment[] = environmentEnum.options.map(env => env);
const DEFAULT_EDITOR_OPTIONS = {
    padding: { top: 8, bottom: 8 },
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on' as const,
    scrollbar: {
        vertical: 'auto' as const,
        horizontal: 'auto' as const,
        useShadows: false
    }
};

interface EditorPanelProps {
    title: string;
    icon: IconName;
    iconColor: string;
    language: string;
    value: string;
    onChange?: (value: string | undefined) => void;
    onMount: (editor: Parameters<OnMount>[0]) => void;
    readOnly: boolean;
    headerContent?: React.ReactNode;
}

interface ConfigurationContentProps {
    configuration: ConfigurationWithDetail;
    handleEditorDidMount: (editor: Parameters<OnMount>[0]) => void;
    isMobile: boolean;
    onRefresh: () => Promise<void>;
}

// Reusable Components
const EditorPanel: React.FC<EditorPanelProps> = ({
    title,
    icon,
    iconColor,
    language,
    value,
    onChange,
    onMount,
    readOnly,
    headerContent
}) => (
    <div className="flex-1 w-full flex flex-col min-h-0">
        <div className='py-1 px-2 border-1 flex justify-between rounded-ss-md items-center flex-shrink-0'>
            <div className='flex items-center gap-4'>
                <Text variant="subtitle" className="flex items-center gap-1">
                    <Icon name={icon} className={cn("h-5 w-5", iconColor)} />
                    {title}
                </Text>
                {headerContent}
            </div>
        </div>
        <div className="flex-1 min-h-0">
            <Editor
                height="100%"
                width="100%"
                language={language}
                theme="vs-dark"
                value={value}
                onChange={onChange}
                onMount={onMount}
                options={{ ...DEFAULT_EDITOR_OPTIONS, readOnly }}
            />
        </div>
    </div>
);

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

    const handleRefresh = useCallback(async () => {
        if (!id) return;
        await fetch(endpoints.configurations.getByIdWithDetails(id));
    }, [id, fetch]);

    useEffect(() => {
        if (id) {
            setActiveConfigurationId('');
            fetch(endpoints.configurations.getByIdWithDetails(id));
        }
    }, [id, fetch]);

    // Set first tab as active when data changes
    useEffect(() => {
        if (data?.length && data[0]?.id) {
            const firstTabId = data[0].id.toString();
            setActiveConfigurationId(firstTabId);
        }
    }, [data]);

    const handleEditorDidMount = useCallback((editor: Parameters<OnMount>[0]) => {
        editor.focus();
    }, []);

    const tabs: TabItem[] = useMemo(() =>
        data?.map((config) => ({
            id: config.id?.toString() || '',
            label: config.name,
            badge: config.configuration_details?.length || 0,
            content: (
                <ConfigurationContent
                    configuration={config}
                    onRefresh={handleRefresh}
                    handleEditorDidMount={handleEditorDidMount}
                    isMobile={isMobile}
                />
            )
        })) || [],
        [data, handleRefresh, handleEditorDidMount, isMobile]);

    if (loading) return <Loader fullScreen />;
    if (!data?.length) return <div className="flex items-center justify-center h-screen">No configurations found</div>;

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
    );
};

const ConfigurationContent: React.FC<ConfigurationContentProps> = ({
    configuration,
    handleEditorDidMount,
    isMobile,
    onRefresh
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Initialize with first non-empty environment or default to development
    const getInitialEnvironment = useCallback((): Environment => {
        const hasContent = (detail: any) => detail && (detail.code || detail.env);

        // Check development first
        const devDetail = configuration.configuration_details?.find(d => d.environment === 'development');
        if (hasContent(devDetail)) return 'development';

        // Find first environment with content
        const envWithContent = ENVIRONMENTS.find(env =>
            hasContent(configuration.configuration_details?.find(d => d.environment === env))
        );

        return envWithContent || 'development';
    }, [configuration.configuration_details]);

    const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>(getInitialEnvironment());
    const [content, setContent] = useState({ code: '', env: '' });
    const [fileType, setFileType] = useState<FileType>(configuration?.file_type || 'yaml');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { postData, loading: createLoading } = usePrivatePostApi();
    const { putData, loading: updateLoading } = usePrivatePutApi();

    const currentDetail = useMemo(() =>
        configuration.configuration_details?.find(d => d.environment === selectedEnvironment),
        [configuration.configuration_details, selectedEnvironment]);

    // Update content when environment changes
    useEffect(() => {
        setContent({
            code: currentDetail?.code || '',
            env: currentDetail?.env || ''
        });
        setFileType(configuration?.file_type || 'yaml');
        setHasUnsavedChanges(false);
        setIsEditing(false);
    }, [selectedEnvironment, currentDetail, configuration?.file_type]);

    const handleContentChange = useCallback((field: 'code' | 'env') => (value: string | undefined) => {
        setContent(prev => ({ ...prev, [field]: value || '' }));
        setHasUnsavedChanges(true);
    }, []);

    const handleFileTypeChange = useCallback((value: string | string[]) => {
        if (typeof value === 'string') {
            setFileType(value as FileType);
            setHasUnsavedChanges(true);
        }
    }, []);

    const handleSave = useCallback(async () => {
        if (!hasUnsavedChanges) return;

        try {
            // Update configuration if file type has changed
            if (fileType !== configuration?.file_type) {
                await putData(endpoints.configurations.update(configuration.id!), { file_type: fileType });
            }

            const endpoint = currentDetail
                ? endpoints.configurationDetails.update(currentDetail.id!)
                : endpoints.configurationDetails.create;

            const payload = currentDetail
                ? { code: content.code, env: content.env, environment: selectedEnvironment }
                : { configuration_id: configuration.id!, environment: selectedEnvironment, code: content.code, env: content.env };

            await (currentDetail ? putData : postData)(endpoint, payload);

            setHasUnsavedChanges(false);
            setIsEditing(false);

            // Store current environment before refresh
            const currentEnv = selectedEnvironment;
            await onRefresh();
            setSelectedEnvironment(currentEnv);
        } catch (error) {
            console.error('Failed to save configuration detail:', error);
        }
    }, [hasUnsavedChanges, currentDetail, putData, postData, content, selectedEnvironment, configuration, fileType, onRefresh]);

    const handleEnvironmentChange = useCallback((value: string | string[]) => {
        if (typeof value === 'string') {
            setSelectedEnvironment(value as Environment);
        }
    }, []);

    const isSaving = createLoading || updateLoading;

    const environmentCombobox = (
        <MyCombobox
            items={environmentEnum.options.map(env => ({ value: env, label: env }))}
            value={selectedEnvironment}
            variant="modern"
            triggerIcon='ChevronDown'
            className='cursor-pointer w-32'
            size="sm"
            showSearch={false}
            onValueChange={handleEnvironmentChange}
            placeholder="Select environment"
        />
    );

    const fileTypeCombobox = (
        <MyCombobox
            items={fileTypeEnum.options.map(type => ({
                value: type,
                label: formatToSentenceCase(type)
            }))}
            value={fileType}
            variant="modern"
            triggerIcon='ChevronDown'
            disabled={!isEditing}
            className='cursor-pointer w-28'
            size="sm"
            showSearch={false}
            onValueChange={handleFileTypeChange}
            placeholder="Select file type"
        />
    );

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
                <Button
                    variant="outline"
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    disabled={isEditing ? (!hasUnsavedChanges || isSaving) : isSaving}
                >
                    <Icon name={isEditing ? 'Save' : 'Edit'} />
                    <span>{isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Content'}</span>
                </Button>
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
                </ResizablePanel>

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
                            <EditorPanel
                                title="Code"
                                icon="CodeXml"
                                iconColor={colorTheme.green.text}
                                language={fileType}
                                value={content.code}
                                onChange={isEditing ? handleContentChange('code') : undefined}
                                onMount={handleEditorDidMount}
                                readOnly={!isEditing}
                                headerContent={
                                    <>
                                        {environmentCombobox}
                                        {fileTypeCombobox}
                                        <Text variant="subtitle">
                                            {currentDetail ? 'Existing' : 'New'} configuration
                                        </Text>
                                    </>
                                }
                            />
                        </ResizablePanel>

                        <ResizableHandle withHandle className="bg-transparent" />

                        {/* Env Editor */}
                        <ResizablePanel defaultSize={40} minSize={20} className="flex flex-col min-h-0">
                            <EditorPanel
                                title="Environment Variable"
                                icon="Lock"
                                iconColor={colorTheme.red.text}
                                language="properties"
                                value={content.env}
                                onChange={isEditing ? handleContentChange('env') : undefined}
                                onMount={handleEditorDidMount}
                                readOnly={!isEditing}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default SectionWrapper(
    "configuration-preview",
    PreviewConfiguration,
    configurationPreviewConfig.breadcrumb,
    <ConfigurationActionButton />,
    { contentPadding: "p-2" }
);
