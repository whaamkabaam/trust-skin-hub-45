import { useParams } from 'react-router-dom';

const LegacyOperatorReview = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen">
      <h1>Legacy Operator Review Page for: {id}</h1>
      <p>Paste your old operator review code here</p>
    </div>
  );
};

export default LegacyOperatorReview;