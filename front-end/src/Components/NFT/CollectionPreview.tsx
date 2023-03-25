import Image from "next/image";
import { useEffect, useState } from "react";

const CollectionPreview = () => {
  const [randomArray, setRandomArray] = useState<number[]>([]);

  useEffect(() => {
    const randomNumbers = () => {
      const array: number[] = [];
      while (array.length < 4) {
        const randomNumber = Math.floor(Math.random() * 20);
        if (!array.includes(randomNumber)) {
          array.push(randomNumber);
        }
      }
      setRandomArray(array);
    };
    randomNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="col-start-2 justify-self-center py-2">
      {/* The button to open modal */}
      <label htmlFor="my-modal-4" className="btn">
        Preview
      </label>

      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex justify-center items-center px-2">
            {randomArray.map((number, index: number) => {
              return (
                <div key={index} className="card bg-gray-500 shadow-xl mx-2">
                  <div className="card-body text-center">
                    <h2 className="text-center">#{number}</h2>
                  </div>
                  <div className="p-2">
                    <Image
                      src={`./cryptodevs/${number}.svg`}
                      alt="0"
                      width={150}
                      height={150}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </label>
      </label>
    </div>
  );
};

export default CollectionPreview;
