export type StepConfig = {
  id: number;
  title: string;
  icon: React.ElementType;
  component: React.ComponentType<StepComponentProps>;
};

export type StepComponentProps = {
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
  step: number;
};
