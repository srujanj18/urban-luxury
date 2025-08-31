import { useLocation } from "react-router-dom";

const MenStyle = () => {
  const location = useLocation();
  const images: string[] = location.state?.images || [];

  return (
    <div>
      <h1>Product Details</h1>
      <div style={{ display: "flex", gap: 16 }}>
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`Product ${idx + 1}`} style={{ width: 200 }} />
        ))}
      </div>
      {/* ...other product details... */}
    </div>
  );
};

export default MenStyle;