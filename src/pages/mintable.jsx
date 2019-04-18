import '../styles/style.less'
import { fetch } from '../components/helpers'
import { FiRefreshCw } from 'react-icons/fi'

const Mintable = props => (
  <div style={{ width: '100%', height: '100%' }}>
    <div style={{ position: 'fixed', top: '50px', left: '50px' }}>
      <button style={{ width: '50px', height: '50px', borderRadius: '50px' }}>
        <FiRefreshCw />
      </button>
    </div>
    <webview
      style={{ width: '100%', height: '100%' }}
      name='google-disable-x-frame-options'
      src={`https://docs.google.com/spreadsheets/d/${props.config.SHEETS_SHEET_ID}`}
    />
  </div>
)

Mintable.getInitialProps = async function() {
  return { config: await fetch('http://localhost:3000/config') }
}

export default Mintable
