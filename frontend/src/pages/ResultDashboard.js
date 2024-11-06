import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from 'page-sections/PersonalizeInsight/PropertyForm';
import ErrorBoundary from 'components/ultility/ErrorBoundary';
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
        <section className="relative min-h-[55.25rem] sm:min-h-[57.25rem] mx-auto flex flex-col items-center justify-center bg-white gap-y-12 p-4 md:p-8 bg-cover bg-top bg-insight-form">
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            <div className="relative z-10 w-full max-w-lg mx-auto">
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