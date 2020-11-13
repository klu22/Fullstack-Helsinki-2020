import React from 'react'


const Filter = (props) => {
  return (
    <form>
      <div>
        filter by name: <input
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    </form>
  )
}


export default Filter