import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';
import { RoomResponse } from '@/types/api/room';

type FilterKey = 'all' | string;
const ITEMS_PER_PAGE = 10;

interface UseRoomsReturn {
  // Data states
  rooms: RoomResponse[];
  currentRooms: RoomResponse[];
  filteredRooms: RoomResponse[];
  selectedRoom: RoomResponse | null;

  // UI states
  currentPage: number;
  searchTerm: string;
  statusFilter: FilterKey;
  floorFilter: string;
  categoryFilter: string;
  isLoading: boolean;
  isLoadingRoom: boolean;
  error: Error | null;

  // Actions
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: FilterKey) => void;
  setFloorFilter: (floor: string) => void;
  setCategoryFilter: (category: string) => void;
  fetchRooms: () => Promise<void>;
  handleRoomAction: (id: string) => Promise<RoomResponse>;

  // Filter options
  filters: Array<{
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
  }>;
}

export const useRooms = (): UseRoomsReturn => {
  // Data states
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);

  // UI states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const realResult = await trpcClient.rooms.getByFilter.query({
        filter: {},
        deleted: false,
      });
      setRooms(realResult);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Error desconocido'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRoomAction = useCallback(async (id: string) => {
    try {
      setIsLoadingRoom(true);
      const room = await trpcClient.rooms.getById.query({ id, deleted: false });
      setSelectedRoom(room);
      return room;
    } catch (error) {
      console.error('Error al cargar los detalles de la habitación:', error);
      toast.error('Error al cargar los detalles de la habitación');
      throw error;
    } finally {
      setIsLoadingRoom(false);
    }
  }, []);

  // Filter logic
  const filteredRooms = useMemo(() => {
    if (!rooms.length) return [];

    const searchLower = searchTerm.toLowerCase();
    return rooms.filter((room: RoomResponse) => {
      const matchesSearch =
        room.number.toString().includes(searchTerm) ||
        room.category.name.toLowerCase().includes(searchLower) ||
        room.category.description.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || room.status.value === statusFilter;
      const matchesFloor = floorFilter === 'all' || room.floor === floorFilter;
      const matchesCategory = categoryFilter === 'all' || room.category.name === categoryFilter;

      return matchesSearch && matchesStatus && matchesFloor && matchesCategory;
    });
  }, [rooms, searchTerm, statusFilter, floorFilter, categoryFilter]);

  // Sort and paginate
  const sortedRooms = useMemo(
    () => [...filteredRooms].sort((a, b) => a.number - b.number),
    [filteredRooms]
  );

  const currentRooms = useMemo(
    () => sortedRooms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [sortedRooms, currentPage]
  );

  // Filter options
  const filters = useMemo(() => {
    const uniqueStatuses = new Set<string>();
    const uniqueFloors = new Set<string>();
    const uniqueCategories = new Set<string>();

    rooms.forEach((room: RoomResponse) => {
      uniqueStatuses.add(room.status.value);
      uniqueFloors.add(room.floor);
      uniqueCategories.add(room.category.name);
    });

    return [
      {
        id: 'status',
        label: 'Estado',
        value: statusFilter,
        onChange: setStatusFilter,
        options: [
          { value: 'all', label: 'Todos los Estados' },
          ...Array.from(uniqueStatuses).map(value => ({
            value,
            label: value,
          })),
        ],
      },
      {
        id: 'floor',
        label: 'Piso',
        value: floorFilter,
        onChange: setFloorFilter,
        options: [
          { value: 'all', label: 'Todos los Pisos' },
          ...Array.from(uniqueFloors).map(floor => ({
            value: floor,
            label: `Piso ${floor}`,
          })),
        ],
      },
      {
        id: 'category',
        label: 'Categoría',
        value: categoryFilter,
        onChange: setCategoryFilter,
        options: [
          { value: 'all', label: 'Todas las Categorías' },
          ...Array.from(uniqueCategories).map(category => ({
            value: category,
            label: category,
          })),
        ],
      },
    ];
  }, [rooms, statusFilter, floorFilter, categoryFilter]);

  return {
    // Data
    rooms,
    currentRooms,
    filteredRooms,
    selectedRoom,

    // UI states
    currentPage,
    searchTerm,
    statusFilter,
    floorFilter,
    categoryFilter,
    isLoading,
    isLoadingRoom,
    error,

    // Actions
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    setFloorFilter,
    setCategoryFilter,
    fetchRooms,
    handleRoomAction,

    // Filters
    filters,
  };
};
