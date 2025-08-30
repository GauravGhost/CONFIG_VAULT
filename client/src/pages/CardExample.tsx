import DisplayWrapper from "@/components/core/wrapper/DisplayWrapper"
import { Button } from "@/components/ui/button"

const CardExample = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">DisplayWrapper Card Mode Examples</h1>
      
      {/* Simple Card */}
      <DisplayWrapper
        mode="card"
        title="Simple Card"
        description="This is a simple card that displays content without any popup behavior"
        size="md"
      >
        <div className="space-y-4">
          <p>This card can be embedded anywhere in your application.</p>
          <p>It's perfect for displaying static content, forms, or any other information.</p>
          <div className="flex gap-2">
            <Button>Action 1</Button>
            <Button variant="outline">Action 2</Button>
          </div>
        </div>
      </DisplayWrapper>

      {/* Card without title/description */}
      <DisplayWrapper
        mode="card"
        size="sm"
        className="bg-blue-50 dark:bg-blue-950"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Custom Content Card</h3>
          <p>This card has no title or description props, just custom content.</p>
        </div>
      </DisplayWrapper>

      {/* Large Card */}
      <DisplayWrapper
        mode="card"
        title="Large Card Example"
        description="This demonstrates a larger card size"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Column 1</h4>
            <p>You can create complex layouts inside cards.</p>
            <ul className="list-disc list-inside text-sm">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Column 2</h4>
            <p>Cards are perfect for organizing content.</p>
            <ul className="list-disc list-inside text-sm">
              <li>Benefit A</li>
              <li>Benefit B</li>
              <li>Benefit C</li>
            </ul>
          </div>
        </div>
      </DisplayWrapper>

      {/* Custom Width Card */}
      <DisplayWrapper
        mode="card"
        title="Custom Width Card"
        description="This card has a custom width"
        width={600}
      >
        <p>You can specify custom widths and heights for cards to fit your specific needs.</p>
      </DisplayWrapper>

      {/* Page Mode Example */}
      <DisplayWrapper
        mode="page"
        title="Page Mode Example"
        description="This is the page mode - no card wrapper, just content"
      >
        <div className="space-y-4">
          <p>The page mode renders content directly without any card wrapper.</p>
          <p>It's useful when you want to display content as part of the page flow.</p>
        </div>
      </DisplayWrapper>

      {/* Comparison with other modes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Compare with Other Display Modes</h2>
        
        <div className="flex gap-4 flex-wrap">
          {/* Dialog Mode */}
          <DisplayWrapper
            mode="dialog"
            trigger="Open Dialog"
            title="Dialog Mode"
            description="This opens in a modal dialog"
          >
            <p>This content appears in a modal dialog when triggered.</p>
          </DisplayWrapper>

          {/* Popover Mode */}
          <DisplayWrapper
            mode="popover"
            trigger="Open Popover"
            title="Popover Mode"
          >
            <p>This content appears in a popover.</p>
          </DisplayWrapper>

          {/* Sheet Mode */}
          <DisplayWrapper
            mode="sheet"
            trigger="Open Sheet"
            title="Sheet Mode"
            description="This opens in a side sheet"
          >
            <p>This content appears in a side sheet.</p>
          </DisplayWrapper>
        </div>
      </div>
    </div>
  )
}

export default CardExample
