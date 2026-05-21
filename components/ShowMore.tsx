import React from "react"

type Props = {
  children: React.ReactNode
}

export function ShowMore({ children }: Props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? 'Show less' : 'Show more'}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}