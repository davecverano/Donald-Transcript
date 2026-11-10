import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the upload form', () => {
  render(<App />);
  expect(screen.getByText(/audio transcriber/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /transcribe/i })).toBeInTheDocument();
});
