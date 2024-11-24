import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Test Button</Button>);
    expect(getByText('Test Button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click Me</Button>
    );
    
    fireEvent.click(getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { container } = render(
      <Button variant="destructive">Delete</Button>
    );
    
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  it('is disabled when loading', () => {
    const { getByRole } = render(
      <Button loading>Loading</Button>
    );
    
    expect(getByRole('button')).toBeDisabled();
  });
});
