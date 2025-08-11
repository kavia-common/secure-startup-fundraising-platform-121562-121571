import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title in topbar', () => {
  render(<App />);
  const title = screen.getByText(/Company Data Room/i);
  expect(title).toBeInTheDocument();
});
