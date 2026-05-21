import userEvent from '@testing-library/user-event'
import { ShowMore } from './ShowMore'
import { render, screen } from '@testing-library/react'

describe('ShowMore', () => {
  it('shows "Show more" button initially', async () => {
    render(<ShowMore> Hidden Content </ShowMore>)
    expect(screen.getByRole('button')).toHaveTextContent('Show more')
  })

  it('shows more content when clicked', async () => {
    const user = userEvent.setup()
    render(<ShowMore> Hidden Content </ShowMore>)
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Hidden Content')).toBeInTheDocument()
  })

  it('hides content when clicked agail', async () => {
    const user = userEvent.setup()
    render(<ShowMore> Hidden Content </ShowMore>)
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button'))
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument()
  })
})

// const user = userEvent.setup()
// await user.click(screen.getByRole('button'))
