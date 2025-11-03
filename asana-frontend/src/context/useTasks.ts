// Unified hook that works with both TaskContext and TaskContextApi
// This hook automatically detects which provider is being used
import { useContext } from 'react';
import { TaskContext as LocalTaskContext } from './TaskContext';
import { TaskContext as ApiTaskContext } from './TaskContextApi';

export function useTasks() {
  // Try API context first (used when TaskProviderApi is active)
  // Check if context is provided by verifying it has the expected structure
  const apiContext = useContext(ApiTaskContext);
  if (apiContext !== undefined && apiContext !== null && 'tasks' in apiContext) {
    return apiContext;
  }

  // Fallback to local context (used when TaskProvider is active)
  const localContext = useContext(LocalTaskContext);
  if (localContext !== undefined && localContext !== null && 'tasks' in localContext) {
    return localContext;
  }

  throw new Error('useTasks must be used within a TaskProvider or TaskProviderApi');
}
