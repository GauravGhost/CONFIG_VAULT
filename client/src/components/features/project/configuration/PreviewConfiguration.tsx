import MarkdownViewer from '@/components/editor/MarkdownViewer';
import { Loader } from '@/components/ui/loader';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { usePrivateGetApi } from '@/hooks/useApi';
import { useIsMobile } from '@/hooks/use-mobile';
import { endpoints } from '@/lib/endpoints';
import type { ConfigurationWithDetail } from '@config-vault/shared';
import { Editor, type OnMount } from '@monaco-editor/react';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import SectionWrapper from '@/components/core/wrapper/SectionWrapper';
import { configurationPreviewConfig } from '@/constant/page-config/project-config';
import MyTabs from '@/components/ui/my-tabs/MyTabs';
import type { TabItem } from '@/components/ui/my-tabs/MyTabs';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

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

    useEffect(() => {
        if (id) {
            fetch(endpoints.configurations.getByIdWithDetails(id));
        }
    }, [id, fetch]);

    // Set the first configuration as active when data loads
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

    // Create tabs from configurations
    const tabs: TabItem[] = data.map((config) => ({
        id: config.id?.toString() || '',
        label: config.name,
        badge: config.configuration_details?.length || 0,
        content: <ConfigurationContent configuration={config} handleEditorDidMount={handleEditorDidMount} isMobile={isMobile} />
    }));

    return (
        <div className="h-screen w-full overflow-hidden">
            <MyTabs 
                tabs={tabs}
                activeTab={activeConfigurationId}
                onTabChange={setActiveConfigurationId}
                variant="default"
                className="h-full flex flex-col"
                tabContentClassName="flex-1 min-h-0 mt-2"
            />
        </div>
    )
}

// Separate component for configuration content
const ConfigurationContent = ({ 
    configuration, 
    handleEditorDidMount, 
    isMobile 
}: { 
    configuration: ConfigurationWithDetail; 
    handleEditorDidMount: (editor: Parameters<OnMount>[0]) => void;
    isMobile: boolean;
}) => (
    <ResizablePanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="h-full w-full gap-1"
    >
        {/* Content */}
        <ResizablePanel
            defaultSize={isMobile ? 30 : 40}
            minSize={isMobile ? 20 : 25}
            className="overflow-auto"
        >
            <div className="h-full p-4">
                <MarkdownViewer content={configuration?.content ?? ""} />
            </div>
        </ResizablePanel >

        <ResizableHandle withHandle className="bg-transparent" />

        {/* Code + Output */}
        <ResizablePanel
            defaultSize={isMobile ? 70 : 60}
            minSize={isMobile ? 40 : 30}
            className="overflow-auto"
        >
            <ResizablePanelGroup direction="vertical" className="h-full gap-1">

                {/* Code Editor */}
                <ResizablePanel defaultSize={60} minSize={40} className="overflow-hidden">
                    <div className="h-full w-full">
                        <Editor
                            height="100%"
                            width="100%"
                            language={configuration?.file_type || "txt"}
                            theme={"vs-dark"}
                            value={configuration?.configuration_details && configuration.configuration_details.length > 0 ? configuration.configuration_details[0].code : ""}
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
                                scrollbar: {
                                    vertical: 'auto',
                                    horizontal: 'auto',
                                    useShadows: false
                                }
                            }}
                        />
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-transparent" />

                {/* Env Editor */}
                <ResizablePanel defaultSize={40} minSize={20} className="overflow-hidden">
                    <div className="h-full w-full">
                        <Editor
                            height="100%"
                            width="100%"
                            language={"txt"}
                            theme={"vs-dark"}
                            value={configuration?.configuration_details && configuration.configuration_details.length > 0 ? configuration.configuration_details[0].env : ""}
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
                                scrollbar: {
                                    vertical: 'auto',
                                    horizontal: 'auto',
                                    useShadows: false
                                }
                            }}
                        />
                    </div>
                </ResizablePanel>

            </ResizablePanelGroup>
        </ResizablePanel>

    </ResizablePanelGroup>
);

export default SectionWrapper("configuration-preview", PreviewConfiguration, configurationPreviewConfig.breadcrumb, <ConfigurationActionButton />)