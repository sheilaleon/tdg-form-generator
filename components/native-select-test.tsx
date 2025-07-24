import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export function NativeSelectTest() {
  const [value, setValue] = React.useState('');

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ];

  return (
    <div className="space-y-4 border border-blue-500 p-4">
      <h2 className="text-lg font-bold">Direct Native Select Test</h2>
      <div className="w-64">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="" disabled>
            Select a fruit
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <p>Selected: {value || 'None'}</p>

      <h2 className="text-lg font-bold">Our Native Select (isNative=true)</h2>
      <div className="w-64">
        <Select value={value} onValueChange={setValue} isNative={true}>
          <SelectTrigger>
            <option value="" disabled>
              Select a fruit
            </option>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectTrigger>
          <SelectContent />
        </Select>
      </div>
      <p>Selected: {value || 'None'}</p>
    </div>
  );
}
