import ReactSelect from 'react-select'
// import {SelectComponents} from "react-select/dist/declarations/src/components";
// import {GroupBase} from 'react-select'
// import {Card} from 'theme-ui'

// const selectComponents: Partial<SelectComponents<{ key: string, value: string }, false, GroupBase<{ key: string, value: string }>>> = {
//     Menu: ({innerProps, children}) => (
//         <Card
//             {...innerProps}
//         >
//             {children}
//         </Card>
//     ),
// }

export function FlexReactSelect() {
  return (
    <div
      style={{
        display: 'flex',
        background: 'lightblue',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <ReactSelect
        options={[
          {
            label: 'anthony',
            value: 0,
          },
          {
            label: 'sennett',
            value: 1,
          },
        ]}
        styles={{
          container: (provided) => ({
            ...provided,
            maxWidth: '200px',
            width: '100%',
          }),
          option: (provided) => ({
            ...provided,
            textAlign: 'left',
          }),
        }}
      />
      {/*<Card/>*/}
    </div>
  )
}
