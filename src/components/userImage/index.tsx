import Image from "next/image";
import Avatar from "react-avatar";

const UserImage = ({
  url,
  name,
  sizeInPixels = 128,

  ...rest
}) => {
  return (
    <>
      {url ? (
        <img
          src={url}
          alt="avatar"
          width={sizeInPixels}
          height={sizeInPixels}
          className="rounded-full"
          {...rest}
        />
      ) : (
        <Avatar
          name={name}
          size={sizeInPixels.toString()}
          round={true}
          className="items-center w-16 h-16 mx-auto rounded-full"
          {...rest}
        />
      )}
    </>
  );
};

export default UserImage;
