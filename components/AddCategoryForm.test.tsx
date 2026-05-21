import { AddCategoryForm } from './AddCategoryForm'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

describe('AddCategoryForm', () => {
  it("doesn't call onAdd function when fields not filled", async () => {
    const onAdd = jest.fn()
    const user = userEvent.setup()
    render(<AddCategoryForm onAdd={onAdd} />)
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('empty submition shows error', async () => {
    const onAdd = jest.fn()
    const user = userEvent.setup()
    render(<AddCategoryForm onAdd={onAdd} />)
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('Category name is required')).toBeInTheDocument()
  })


  it("onAdd called with input value when submited", async()=>{
     const onAdd = jest.fn()
    const user = userEvent.setup()
    render(<AddCategoryForm onAdd={onAdd} />)
    await user.type(screen.getByPlaceholderText('Category name'), 'Food')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(onAdd).toHaveBeenCalledWith('Food')
  })
})

// const onAdd = jest.fn()
// render(<AddCategoryForm onAdd={onAdd} />)

// // type into input
// await user.type(screen.getByPlaceholderText('Category name'), 'Food')

// // assert mock was called with specific value
// expect(onAdd).toHaveBeenCalledWith('Food')
