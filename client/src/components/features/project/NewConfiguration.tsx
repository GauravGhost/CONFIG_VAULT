import DisplayWrapper from '@/components/core/wrapper/DisplayWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { FormFieldItem } from '@/components/ui/my-form';
import MyForm from '@/components/ui/my-form';
import { Textarea } from '@/components/ui/textarea';
import MyCombobox from '@/components/ui/my-combobox/MyCombobox';
import { usePrivatePostApi } from '@/hooks/useApi';
import { endpoints } from '@/lib/endpoints';
import useLoaderStore from '@/store/useLoaderStore';
import { environmentEnum, fileTypeEnum, schema, sharingTypeEnum, type Configuration, type ConfigurationWithDetailCreate } from '@config-vault/shared';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { formatToSentenceCase } from '@/lib/utils';
import TextEditor from '@/components/editor/TextEditor';
import Editor, { type OnMount } from '@monaco-editor/react';

const NewConfiguration = () => {
  const { startLoading, stopLoading } = useLoaderStore();
  const projectApi = usePrivatePostApi<Configuration>();
  const { id } = useParams();

  const envTypeItems = environmentEnum.options.map(option => ({
    value: option,
    label: formatToSentenceCase(option)
  }));

  const fileTypeItems = fileTypeEnum.options.map(option => ({
    value: option,
    label: formatToSentenceCase(option)
  }));

  const sharingTypeItems = sharingTypeEnum.options.map(option => ({
    value: option,
    label: formatToSentenceCase(option)
  }));
  const handleEditorDidMount = (editor: Parameters<OnMount>[0]) => {
    editor.focus();
  };
  const formItemData: FormFieldItem<ConfigurationWithDetailCreate>[] = [
    {
      label: "Name",
      name: "name",
      layout: {
        row: 0,
        width: "1/2"
      },
      render: ({ field }) => <Input placeholder="Enter Configuration Name" {...field} value={field.value as string} />
    },
    {
      label: "Sharing Type",
      name: "sharing_type",
      layout: {
        row: 0,
        width: "1/2"
      },
      render: ({ field }) => {

        return (
          <MyCombobox
            items={sharingTypeItems}
            value={field.value as string}
            onValueChange={field.onChange}
            placeholder="Select sharing type"
            searchPlaceholder="Search sharing types..."
            showSearch={false}
          />
        );
      }
    },
    {
      label: "Content (Optional)",
      name: "content",
      layout: {
        row: 1,
        width: "full"
      },
      render: ({ field }) => <TextEditor
        content={field.value as string}
        onChange={field.onChange}
      />
    },
    {
      label: "File Type",
      name: "file_type",
      layout: {
        row: 2,
        width: "1/2"
      },
      render: ({ field }) =>
        <MyCombobox
          items={fileTypeItems}
          value={field.value as string}
          onValueChange={field.onChange}
          placeholder="Select file type"
          searchPlaceholder="Search file types..."
          showSearch={false}
        />
    },
    {
      label: "Environment",
      name: "configuration_details.environment",
      layout: {
        row: 2,
        width: "1/2"
      },
      render: ({ field }) =>
        <MyCombobox
          items={envTypeItems}
          value={field.value as string}
          onValueChange={field.onChange}
          placeholder="Select environment"
          searchPlaceholder="Search environments..."
          showSearch={false}
        />
    },
    {
      label: "Configuration Code",
      name: "configuration_details.code",
      layout: {
        row: 3,
        width: "1/2"
      },
      render: ({ field }) => <Textarea placeholder="Enter configuration code" {...field} value={field.value as string} rows={10} />
    },
    {
      label: "Environment Name (Optional)",
      name: "configuration_details.env",
      layout: {
        row: 3,
        width: "1/2"
      },
      render: ({ field }) =>
        <div className="h-full overflow-auto">

          <Editor
            height="100%"
            language={"yaml"}
            theme={"vs-dark"}
            value={field.value as string}
            onChange={field.onChange}
            onMount={handleEditorDidMount}
            options={{
              padding: { top: 8 },
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: true,
              automaticLayout: true,
            }}
          />
        </div>
    },
  ]
  const handleSubmit = async (values: ConfigurationWithDetailCreate) => {
    await projectApi.postData(endpoints.configuration.create, values as any, {
      actionCallbacks: {
        onSuccess: () => {
          toast.success("Configuration created successfully");
        },
        onError: (error) => toast.error(error ?? "Something went wrong"),
        onLoadingStart: () => startLoading(),
        onLoadingStop: () => stopLoading(),
      }
    });
  };
  return (
    <div className="flex justify-center pt-10">
      <DisplayWrapper
        mode="card"
        title={"New Configuration"}
        description={"Create a new configuration"}
        size="lg"

        className="w-full"
      >
        <MyForm
          formSchema={schema.create.configurationWithDetail}
          defaultValues={{
            project_id: id || "",
            name: "",
            content: "",
            file_type: "yaml",
            sharing_type: "private",
            configuration_details: {
              environment: "development",
              code: "",
              env: ""
            }
          }}
          maxHeight={null}
          formItemData={formItemData}
          onSubmit={handleSubmit}
          buttonActions={<Button type="submit" className="ml-auto block">Create</Button>}
        />


      </DisplayWrapper>
    </div>
  )
}

export default NewConfiguration
