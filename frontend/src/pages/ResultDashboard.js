import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from 'page-sections/PersonalizeInsight/PropertyForm';
import ErrorBoundary from 'components/ErrorBoundary';
import withErrorBoundary from 'hoc/withErrorBoundary';

const ResultDashboardContent = () => {
    const navigate = useNavigate();

    const handleSubmitSuccess = (predictionResult) => {
        // Store the result in localStorage or state management solution
        localStorage.setItem('predictionResult', JSON.stringify(predictionResult));
        // Navigate to PersonalizeInsight page
        navigate('/personalize-insight');
    };

    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-12 p-4 md:p-8">
            <div className="w-full max-w-lg mx-auto">
                <PropertyForm onSubmitSuccess={handleSubmitSuccess} />
            </div>
        </section>
    );
};

const ResultDashboard = () => {
    return (
        <ErrorBoundary>
            <ResultDashboardContent />
        </ErrorBoundary>
    );
};

export default withErrorBoundary(ResultDashboard);