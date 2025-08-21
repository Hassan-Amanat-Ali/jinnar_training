# UI Components Guide

This guide explains how to use each UI component in your React application.

## 🚀 Quick Start

All UI components are located in `src/components/ui/` and can be imported like this:

```javascript
import { Button, Card, Input, Modal } from '../components/ui';
```

## 📋 Available Components

### 1. Button Component

**Purpose**: Clickable buttons with different styles and states

**Basic Usage**:

```javascript
<Button>Click me</Button>
```

**Props**:

- `variant`: `'primary'` | `'secondary'` | `'outline'` | `'ghost'` | `'danger'`
- `size`: `'sm'` | `'md'` | `'lg'` | `'xl'`
- `loading`: `boolean` - Shows spinner when true
- `disabled`: `boolean` - Disables the button
- `onClick`: `function` - Click handler
- `className`: `string` - Additional CSS classes

**Examples**:

```javascript
// Different styles
<Button variant="primary">Save</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Cancel</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With loading state
<Button loading={isLoading} onClick={handleSubmit}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>

// Disabled button
<Button disabled>Can't click</Button>
```

### 2. Input Component

**Purpose**: Form input fields with labels, validation, and icons

**Basic Usage**:

```javascript
<Input
  label='Your Name'
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder='Enter your name'
/>
```

**Props**:

- `label`: `string` - Input label
- `placeholder`: `string` - Placeholder text
- `value`: `string` - Input value
- `onChange`: `function` - Change handler
- `error`: `string` - Error message to display
- `helperText`: `string` - Helper text below input
- `leftIcon`: `ReactNode` - Icon on the left
- `rightIcon`: `ReactNode` - Icon on the right
- `size`: `'sm'` | `'md'` | `'lg'`
- `type`: `string` - Input type (text, email, password, etc.)

**Examples**:

```javascript
// Basic input
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="your@email.com"
/>

// With error
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={password.length < 6 ? 'Too short' : ''}
/>

// With icon
<Input
  leftIcon={<EmailIcon />}
  placeholder="Email address"
/>

// With helper text
<Input
  label="Password"
  helperText="Must be at least 8 characters"
/>
```

### 3. Card Component

**Purpose**: Container for content with consistent styling

**Basic Usage**:

```javascript
<Card>
  <Card.Body>
    <h3>Card Title</h3>
    <p>Card content goes here</p>
  </Card.Body>
</Card>
```

**Parts**:

- `Card.Header` - Top section with border
- `Card.Body` - Main content area
- `Card.Footer` - Bottom section with border

**Props**:

- `shadow`: `'none'` | `'sm'` | `'md'` | `'lg'` | `'xl'`
- `rounded`: `'none'` | `'sm'` | `'md'` | `'lg'` | `'xl'`
- `padding`: `'none'` | `'sm'` | `'md'` | `'lg'` | `'xl'`
- `border`: `boolean` - Show border
- `className`: `string` - Additional CSS classes

**Examples**:

```javascript
// Simple card
<Card>
  <Card.Body>
    <h3>Simple Card</h3>
    <p>Just some content</p>
  </Card.Body>
</Card>

// Card with header and footer
<Card>
  <Card.Header>
    <h3>User Profile</h3>
  </Card.Header>
  <Card.Body>
    <p>User information here</p>
  </Card.Body>
  <Card.Footer>
    <Button>Edit</Button>
    <Button variant="outline">Delete</Button>
  </Card.Footer>
</Card>

// Custom styling
<Card shadow="lg" rounded="xl">
  <Card.Body>
    <p>Card with large shadow and extra rounded corners</p>
  </Card.Body>
</Card>

// For images (no padding)
<Card>
  <Card.Body padding="none">
    <img src="image.jpg" alt="Demo" />
    <div className="p-4">
      <h3>Image Card</h3>
      <p>Content with custom padding</p>
    </div>
  </Card.Body>
</Card>
```

### 4. Modal Component

**Purpose**: Overlay dialogs for forms, confirmations, etc.

**Basic Usage**:

```javascript
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header>
    <h3>Modal Title</h3>
  </Modal.Header>
  <Modal.Body>
    <p>Modal content</p>
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </Modal.Footer>
</Modal>;
```

**Parts**:

- `Modal.Header` - Top section with title
- `Modal.Body` - Main content area
- `Modal.Footer` - Bottom section with buttons

**Props**:

- `isOpen`: `boolean` - Whether modal is open
- `onClose`: `function` - Function to close modal
- `size`: `'sm'` | `'md'` | `'lg'` | `'xl'` | `'full'`
- `showCloseButton`: `boolean` - Show X button (default: true)
- `closeOnOverlayClick`: `boolean` - Close when clicking outside (default: true)
- `closeOnEscape`: `boolean` - Close when pressing Escape (default: true)

**Examples**:

```javascript
// With useToggle hook (recommended)
import { useToggle } from '../hooks';

const [isModalOpen, { toggle: toggleModal }] = useToggle();

<Button onClick={toggleModal}>Open Modal</Button>

<Modal isOpen={isModalOpen} onClose={toggleModal}>
  <Modal.Header>
    <h3>Confirm Action</h3>
  </Modal.Header>
  <Modal.Body>
    <p>Are you sure you want to delete this item?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={toggleModal}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>

// Large modal
<Modal isOpen={isOpen} onClose={onClose} size="lg">
  <Modal.Body>
    <form>
      {/* Form content */}
    </form>
  </Modal.Body>
</Modal>
```

## 🎯 Common Patterns

### Form with Validation

```javascript
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  // Validate and submit
};

<form onSubmit={handleSubmit}>
  <Input
    label='Email'
    type='email'
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    error={errors.email}
  />

  <Input
    label='Password'
    type='password'
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    error={errors.password}
  />

  <Button type='submit' loading={isLoading}>
    Sign In
  </Button>
</form>;
```

### Confirmation Modal

```javascript
const [showConfirm, { toggle: toggleConfirm }] = useToggle();

const handleDelete = () => {
  // Delete logic here
  toggleConfirm(); // Close modal
};

<Button variant="danger" onClick={toggleConfirm}>
  Delete Item
</Button>

<Modal isOpen={showConfirm} onClose={toggleConfirm} size="sm">
  <Modal.Header>
    <h3>Confirm Delete</h3>
  </Modal.Header>
  <Modal.Body>
    <p>This action cannot be undone.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={toggleConfirm}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>
```

### Card Grid Layout

```javascript
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
  {items.map((item) => (
    <Card key={item.id} className='hover:shadow-lg transition-shadow'>
      <Card.Body>
        <h3 className='text-lg font-semibold'>{item.title}</h3>
        <p className='text-gray-600'>{item.description}</p>
      </Card.Body>
      <Card.Footer>
        <Button size='sm'>View Details</Button>
      </Card.Footer>
    </Card>
  ))}
</div>
```

## 🔧 Customization

All components accept a `className` prop for additional styling:

```javascript
<Button className="w-full mt-4">Full Width Button</Button>
<Card className="border-blue-200 bg-blue-50">Custom Card</Card>
<Input className="font-mono" placeholder="Monospace font" />
```

## 🎨 Styling System

Components use Tailwind CSS classes and follow these design tokens:

- **Colors**: Blue for primary, Gray for neutral, Red for danger
- **Spacing**: Consistent padding and margins
- **Shadows**: Multiple levels (sm, md, lg, xl)
- **Rounded**: Multiple levels (sm, md, lg, xl)
- **Transitions**: Smooth hover and focus states

## 📱 Responsive Design

All components are mobile-first and responsive:

```javascript
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
  <Card>Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols</Card>
</div>
```

## ✅ Best Practices

1. **Always provide labels for inputs** for accessibility
2. **Use loading states** for async operations
3. **Show error messages** for validation
4. **Use appropriate button variants** (danger for destructive actions)
5. **Keep modal content focused** and not too large
6. **Use consistent spacing** with Tailwind classes

## 🚀 Live Demo

Visit `/components` in your app to see all components in action with live examples!

## 🆘 Need Help?

- Check the demo page at `/components` for live examples
- Look at existing pages (Login, Contact, etc.) for usage patterns
- All components are fully documented with JSDoc comments
- Components are TypeScript-ready for better development experience
