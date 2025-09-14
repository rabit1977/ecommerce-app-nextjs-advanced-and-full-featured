
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartItem } from './cart-item';
import { useApp } from '@/lib/context/app-context';
import { CartItem as CartItemType } from '@/lib/types';

// Mock the useApp hook
jest.mock('@/lib/context/app-context', () => ({
  useApp: jest.fn(),
}));

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

const mockItem: CartItemType = {
  cartItemId: '1',
  id: 'prod1',
  title: 'Test Product',
  price: 100,
  quantity: 2,
  image: '/test-image.jpg',
  options: {
    color: '#ff0000',
    size: 'M',
  },
};

describe('CartItem', () => {
  const mockUpdateCartQuantity = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockSaveForLater = jest.fn();

  beforeEach(() => {
    (useApp as jest.Mock).mockReturnValue({
      updateCartQuantity: mockUpdateCartQuantity,
      removeFromCart: mockRemoveFromCart,
      saveForLater: mockSaveForLater,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders item details correctly', () => {
    render(<CartItem item={mockItem} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument(); // price * quantity
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toHaveAttribute('src', '/test-image.jpg');
    expect(screen.getByText('color:')).toBeInTheDocument();
    expect(screen.getByText('size: M')).toBeInTheDocument();
  });

  it('calls updateCartQuantity when quantity buttons are clicked', () => {
    render(<CartItem item={mockItem} />);

    fireEvent.click(screen.getByLabelText('Decrease quantity'));
    expect(mockUpdateCartQuantity).toHaveBeenCalledWith('1', 1);

    fireEvent.click(screen.getByLabelText('Increase quantity'));
    expect(mockUpdateCartQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('calls saveForLater when "Save for Later" is clicked', () => {
    render(<CartItem item={mockItem} />);

    fireEvent.click(screen.getByText('Save for Later'));
    expect(mockSaveForLater).toHaveBeenCalledWith('1');
  });

  it('calls removeFromCart when "Remove" is clicked', () => {
    render(<CartItem item={mockItem} />);

    fireEvent.click(screen.getByText('Remove'));
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  describe('OptionDisplay', () => {
    it('renders a color swatch for a color option', () => {
      render(<CartItem item={mockItem} />);
      const colorSwatch = screen.getByTitle('#ff0000');
      expect(colorSwatch).toBeInTheDocument();
      expect(colorSwatch).toHaveStyle('backgroundColor: #ff0000');
    });

    it('renders text for a non-color option', () => {
      render(<CartItem item={mockItem} />);
      expect(screen.getByText('size: M')).toBeInTheDocument();
    });
  });
});
