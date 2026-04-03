import { useMutation } from '@tanstack/react-query';
import { login } from '../services/api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate('/dashboard');
    },
  });
};
