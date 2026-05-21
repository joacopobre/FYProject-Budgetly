import { useState } from 'react'

type Props = {
  onAdd: (category: string) => void
}

export function AddCategoryForm({ onAdd }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!value.trim()) {
      setError('Category name is required')
      return
    }
    onAdd(value.trim())
    setValue('')
    setError('')
  }

  return (
    <div>
      <input
        placeholder="Category name"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <button onClick={handleSubmit}>Add</button>
    </div>
  )
}
