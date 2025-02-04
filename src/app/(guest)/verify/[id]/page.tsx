import VerifyAccount from "@/components/verify/activeAccount/ActiveAccount";

const VerifyPage = ({ params }: { params: { id: String } }) => {
  return (
    <div>
      <VerifyAccount params={params} />
    </div>
  );
};

export default VerifyPage;
