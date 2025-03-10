'use client';

import React, { useEffect, useState } from 'react';
import { useRooms } from '@/hooks/useRooms';
import { useRoomStatus } from '@/hooks/useRoomStatus';
import { isBackendAvailable } from '@/utils/trpcHelpers';

/**
 * Página de prueba para verificar la conexión con el backend
 * Esta página es solo para desarrollo y debugging
 */
const ApiTestPage: React.FC = () => {
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
    fetchRooms,
    isBackendConnected: roomsConnected,
  } = useRooms();
  const {
    roomStatuses,
    loading: statusesLoading,
    error: statusesError,
    fetchRoomStatuses,
    isBackendConnected: statusesConnected,
  } = useRoomStatus();

  useEffect(() => {
    const checkBackend = async () => {
      const available = await isBackendAvailable();
      setBackendAvailable(available);
    };

    checkBackend();
  }, []);

  useEffect(() => {
    if (backendAvailable) {
      fetchRooms();
      fetchRoomStatuses();
    }
  }, [backendAvailable, fetchRooms, fetchRoomStatuses]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Backend Connection Status</h2>
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          {backendAvailable === null ? (
            <span className="text-yellow-500">Checking...</span>
          ) : backendAvailable ? (
            <span className="text-green-500">Connected</span>
          ) : (
            <span className="text-red-500">Disconnected</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Rooms</h2>
          <div className="mb-2">
            <span className="font-medium">Connection:</span>{' '}
            {roomsConnected ? (
              <span className="text-green-500">Connected</span>
            ) : (
              <span className="text-red-500">Using Mock Data</span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-medium">Status:</span>{' '}
            {roomsLoading ? (
              <span className="text-yellow-500">Loading...</span>
            ) : roomsError ? (
              <span className="text-red-500">Error: {roomsError}</span>
            ) : (
              <span className="text-green-500">Loaded</span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-medium">Count:</span> {rooms.length}
          </div>
          <button
            onClick={() => fetchRooms()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Rooms
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Room Statuses</h2>
          <div className="mb-2">
            <span className="font-medium">Connection:</span>{' '}
            {statusesConnected ? (
              <span className="text-green-500">Connected</span>
            ) : (
              <span className="text-red-500">Using Mock Data</span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-medium">Status:</span>{' '}
            {statusesLoading ? (
              <span className="text-yellow-500">Loading...</span>
            ) : statusesError ? (
              <span className="text-red-500">Error: {statusesError}</span>
            ) : (
              <span className="text-green-500">Loaded</span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-medium">Count:</span> {roomStatuses.length}
          </div>
          <button
            onClick={() => fetchRoomStatuses()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Statuses
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
        <pre className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-96">
          {JSON.stringify({ backendAvailable, roomsConnected, statusesConnected }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ApiTestPage;
