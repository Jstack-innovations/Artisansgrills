import { useState } from "react";
import "./Css/MenuModal.css";

export default function MenuModal({
  category,
  items = [],
  onClose,
  addToCart,
  setPreviewItem
}) {

  const [addedItems, setAddedItems] = useState<string[]>([]);

  if (!category) return null;

  const handleAdd = (item:any) => {

    addToCart?.(item);

    setAddedItems(prev => [...prev, item.id]);

    setTimeout(() => {
      setAddedItems(prev =>
        prev.filter(id => id !== item.id)
      );
    }, 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      <div
        className="menu-modal"
        onClick={e => e.stopPropagation()}
      >

        <div className="menu-modal-header">
          <h2>{category.toUpperCase()}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="menu-modal-grid">

          {items.map((item:any) => (
            <div key={item.id} className="menu-modal-card">

              <div className="menu-modal-image-wrap">
                <img
                  src={item.image}
                  className="menu-modal-image"
                  onClick={() => setPreviewItem?.(item)}
                />

                {item.tags && (
                  <div className="menu-modal-tags">
                    {item.tags.map((tag:string) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              <div className="menu-modal-content">

                <h3>{item.name}</h3>

                <p>{item.description}</p>

                {item.signature && (
                  <div className="signature">
                    ✨ {item.signature}
                  </div>
                )}

                <div className="menu-modal-footer">

                  <b>${item.price}</b>

                  <button
                    className={`add-order-btn ${
                      addedItems.includes(item.id) ? "added" : ""
                    }`}
                    onClick={() => handleAdd(item)}
                  >
                    {addedItems.includes(item.id)
                      ? "✓ ORDER ADDED"
                      : "ADD ORDER"
                    }
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
