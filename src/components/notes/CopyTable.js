import React, {useRef, useState} from 'react';

// Copies the toolkit's sales table so learners can paste it into Excel or Google Sheets.
const TSV = [
  'Date\tStore\tRegion\tProduct\tUnits\tSales ($)',
  '2025-03-03\tS01\tNorth\tShoes\t12\t780',
  '2025-03-03\tS01\tNorth\tBags\t8\t384',
  '2025-03-03\tS02\tNorth\tShoes\t10\t650',
  '2025-03-03\tS02\tNorth\tBags\t5\t240',
  '2025-03-03\tS03\tSouth\tShoes\t20\t1235',
  '2025-03-04\tS01\tNorth\tShoes\t15\t975',
  '2025-03-04\tS02\tNorth\tShoes\t12\t780',
  '2025-03-04\tS02\tNorth\tBags\t5\t240',
].join('\n');

export default function CopyTable() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const box = useRef(null);
  const fallback = () => {
    setShow(true);
    setMsg('Press Ctrl+C (or Command+C) to copy the selected text.');
    setTimeout(() => box.current && box.current.select(), 0);
  };
  const copy = () => {
    try {
      navigator.clipboard.writeText(TSV).then(() => setMsg('Copied. Now paste into cell A5.'), fallback);
    } catch (e) {
      fallback();
    }
  };
  return (
    <div className="nbs-copy">
      <p>
        <button type="button" className="btn" onClick={copy}>Copy the table</button>{' '}
        <span className="small" aria-live="polite">{msg}</span>
      </p>
      {show ? <textarea ref={box} readOnly value={TSV} rows={9} style={{width: '100%'}} /> : null}
    </div>
  );
}
