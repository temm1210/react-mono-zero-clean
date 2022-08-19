function Slider() {
  return (
    <div className="slider">
      <div
        role="slider"
        aria-label="horizontal slider"
        aria-valuenow={20}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-orientation="horizontal"
        tabIndex={0}
      />
    </div>
  );
}

export default Slider;
