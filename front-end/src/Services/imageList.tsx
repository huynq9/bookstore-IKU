import { Image } from "antd";

interface ImageListProps {
    images: {
        url: string,
        publicId: string
    }[]; 
  }
  
  function ImageList({ images }: ImageListProps) {
    return (
      <div>
        {images.map((imageObj, index) => (
          <Image key={index} width={100} src={imageObj?.url} alt={`Image ${imageObj.publicId}`} />
        ))}
      </div>
    );
  }
  
  export default ImageList;