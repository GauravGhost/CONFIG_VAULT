import { z } from "zod";
import MyForm from "./my-form";

// Example usage to test the types
const exampleSchema = z.object({
  name: z.string(),
  email: z.string(),
  age: z.number().optional(),
});

type ExampleFormData = z.infer<typeof exampleSchema>;

const defaultValues: ExampleFormData = {
  name: "",
  email: "",
};

const formFields = [
  {
    label: "Name",
    name: "name" as const,
    render: ({ field }: any) => <input {...field} />,
  },
  {
    label: "Email", 
    name: "email" as const,
    render: ({ field }: any) => <input {...field} type="email" />,
  },
];

const ExampleForm = () => {
  return (
    <MyForm
      formSchema={exampleSchema}
      defaultValues={defaultValues}
      formItemData={formFields}
      onSubmit={(values) => {
        console.log("Form submitted:", values);
        // values is properly typed as ExampleFormData
      }}
    />
  );
};

export default ExampleForm;
