import { DashboardIcons, IconWrapper } from './icons';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  totalResults?: number;
}

const SearchFilter = ({ searchTerm, onSearchChange, filters, totalResults }: SearchFilterProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
          <span className="absolute left-3 top-2.5">
            <IconWrapper className="fill-gray-500 dark:fill-gray-400">
              <DashboardIcons.Search />
            </IconWrapper>
          </span>
        </div>

        {filters &&
          filters.map(filter => (
            <div key={filter.id} className="w-full sm:w-auto">
              <select
                className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                value={filter.value}
                onChange={e => filter.onChange(e.target.value)}
                aria-label={filter.label}
              >
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </div>

      {totalResults !== undefined && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalResults} resultados
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
