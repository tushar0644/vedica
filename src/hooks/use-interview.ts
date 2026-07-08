import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewService } from "@/services/interview/interview.service";

export const useInterviewStatus = () => {
  return useQuery({
    queryKey: ["interview-status"],
    queryFn: () => interviewService.getInterviewStatus(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useAvailableDates = () => {
  return useQuery({
    queryKey: ["interview-dates"],
    queryFn: () => interviewService.getAvailableDates(),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};

export const useAvailableSlots = (date: string | null) => {
  return useQuery({
    queryKey: ["interview-slots", date],
    queryFn: () => interviewService.getAvailableSlots(date || ""),
    enabled: !!date,
    staleTime: 1000 * 30, // 30 seconds cache for live seats
  });
};

export const useBookInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewService.bookInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-status"] });
      queryClient.invalidateQueries({ queryKey: ["interview-dates"] });
      queryClient.invalidateQueries({ queryKey: ["interview-slots"] });
    },
  });
};

export const useRescheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewService.rescheduleInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-status"] });
      queryClient.invalidateQueries({ queryKey: ["interview-dates"] });
      queryClient.invalidateQueries({ queryKey: ["interview-slots"] });
    },
  });
};

export const useCancelInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewService.cancelInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-status"] });
      queryClient.invalidateQueries({ queryKey: ["interview-dates"] });
      queryClient.invalidateQueries({ queryKey: ["interview-slots"] });
    },
  });
};
