import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from './utils';
import { toast } from 'react-toastify';

export const useFetchTasks = () => {
  // useQuery - to fetch data

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ['tasks'],
    // queryFn handles asynchronous nature of the customFetch.get('/') request and returning the data
    // our data is in - data.data.taskList
    // but we can override async await and tell to return data.data
    queryFn: async () => {
      const { data } = await customFetch.get('/');
      return data;
    },
  });

  return { isLoading, data, isError, error };
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  // useMutation - to create & update data
  const { mutate: createTask, isLoading } = useMutation({
    mutationFn: (taskTitle) => customFetch.post('/', { title: taskTitle }),

    onSuccess: () => {
      // queryClient.invalidateQueries - triggering refetch of data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('tasks added');
    },

    onError: (error) => {
      toast.error(error.response.data.msg);
    },
  });

  return { createTask, isLoading };
};

export const useEditTask = () => {
  const queryClient = useQueryClient();
  const { mutate: editTask } = useMutation({
    mutationFn: ({ taskId, isDone }) =>
      customFetch.patch(`/${taskId}`, { isDone }),

    onSuccess: () => {
      // queryClient.invalidateQueries - triggering refetch of data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('tasks edited');
    },
  });

  return { editTask };
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteTask, isLoading } = useMutation({
    mutationFn: ({ taskId }) => customFetch.delete(`/${taskId}`),

    onSuccess: () => {
      // queryClient.invalidateQueries - triggering refetch of data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('tasks deleted');
    },
  });

  return { deleteTask, isLoading };
};
