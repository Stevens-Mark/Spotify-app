import React, { useRef, useEffect } from 'react';
import FocusTrap from 'focus-trap-react';

const ConfirmationModal = ({ onConfirm, onCancel, chosenPlaylist }) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    // When the modal opens, set focus on the modal itself and trap focus within it
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    // Close the modal when Escape key is pressed
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <FocusTrap active>
      <div
        ref={modalRef}
        tabIndex={-1}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
        onKeyDown={handleKeyDown}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
          className="bg-white rounded-md p-5 m-3"
        >
          <h2 id="modal-heading" className="text-black font-bold text-lg">
            Already Added ?
          </h2>
          <p>This is already in your &#39;{chosenPlaylist?.name}&#39; playlist</p>
          <div className="mt-6 flex justify-between">
            <button
              ref={cancelButtonRef}
              className="p-2 font-bold text-pink-swan hover:text-black hover:scale-110 focus:text-black focus:scale-110 transition delay-100 duration-300 ease-in-out"
              onClick={onConfirm}
            >
              Add anyway
            </button>
            <button
              className="px-4 py-2 rounded-full bg-green-500 text-black font-bold hover:scale-110 focus:scale-110 transition delay-100 duration-300 ease-in-out"
              onClick={onCancel}
            >
              Don&apos;t add
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default ConfirmationModal;
