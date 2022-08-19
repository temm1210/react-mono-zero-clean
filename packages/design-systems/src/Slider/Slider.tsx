export interface SliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
}

function Slider({ min = 0, max = 100, defaultValue = 0 }: SliderProps) {
  return (
    <div className="slider">
      <div
        role="slider"
        aria-label="horizontal slider"
        aria-valuenow={defaultValue}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-orientation="horizontal"
        tabIndex={0}
      />
    </div>
  );
}

export default Slider;
