import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the main dashboard title', () => {
    // Render the App component in Virtual DOM
    render(<App />);
    
    // Search for the title element - ignore case sensitivity
    const titleElement = screen.getByText(/Energy Dashboard/i);
    
    //  Check if the title element is present in the document
    expect(titleElement).toBeInTheDocument();
  });
});