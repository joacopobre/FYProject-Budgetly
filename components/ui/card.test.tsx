import { render, screen } from '@testing-library/react'
import { Card, CardTitle } from './card'

describe('Card', () => {
  it('render children', () => {
    render(<Card>Hello</Card>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('adds custo class names', () => {
    const { container } = render(<Card className="custom-class-name">Hello</Card>)
    expect(container.firstChild).toHaveClass('custom-class-name')
  })

  it('sub-components render their content', () => {
    render(<CardTitle>Monthly Budget</CardTitle>)
    expect(screen.getByText('Monthly Budget')).toBeInTheDocument()
  })
})

// // components/BudgetCard.test.tsx
// import { render, screen } from '@testing-library/react';
// import { BudgetCard } from './BudgetCard';

// describe('BudgetCard', () => {
//   it('renders the label', () => {
//     render(<BudgetCard label="Monthly Budget" amount={500} />);
//     expect(screen.getByText('Monthly Budget')).toBeInTheDocument();
//   });

//   it('displays the formatted amount', () => {
//     render(<BudgetCard label="Savings" amount={1200.5} />);
//     expect(screen.getByTestId('amount')).toHaveTextContent('£1200.50');
//   });
// });
