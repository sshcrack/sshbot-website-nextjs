import ModeProps from 'utils/modeProps';

export const Basic = ({ data }: ModeProps) => (
  <div>
    <span>Data {JSON.stringify(data)}</span>
  </div>
)