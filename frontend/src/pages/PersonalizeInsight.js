// src/pages/PersonalizeInsight.js
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from 'components/ErrorBoundary';
import withErrorBoundary from 'hoc/withErrorBoundary';
import PredictionResult from '../components/PredictionResult';

// Visualizations
import BarChart from 'visualization/bar-chart/BarChart';
import Choropleth from 'visualization/choropleth/Choropleth';
import LineChart from 'visualization/line-chart/LineChart';

const PersonalizeInsightContent = () => {
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedResult = localStorage.getItem('predictionResult');
        if (!storedResult) {
            // Redirect to form if no result is found
            navigate('/result-dashboard');
            return;
        }
        setResult(JSON.parse(storedResult));
    }, [navigate]);

    if (!result) return null;

    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-12 p-4 md:p-8">
            <section className='grid md:grid-cols-2 gap-8 w-full'>
                <PredictionResult result={result} />
                <section className='w-full bg-gray-50 rounded-lg p-4 overflow-auto shadow-md'>
                    <h3 className="sm:text-h3 text-h3-sm text-center">How much would the same property cost in different states?</h3>
                    <div className='h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)]'>
                        <Choropleth />
                    </div>
                </section>
            </section>
            <section className='grid md:grid-cols-2 gap-8 w-full'>
                <div className="w-full max-h-[25rem] bg-gray-50 rounded-lg p-4 overflow-auto shadow-md">
                    <h3 className="sm:text-h3 text-h3-sm text-center">House prices in different cities in the same state</h3>
                    <div className='h-[calc(100%-3rem-41px)] sm:h-[calc(100%-4rem-41px)]'>
                        <BarChart />
                    </div>
                </div>
                <div className="w-full max-h-[25rem] bg-gray-50 rounded-lg p-4 overflow-auto shadow-md">
                    <h3 className="sm:text-h3 text-h3-sm text-center">Price vs living/land area line chart</h3>
                    <div className='h-[calc(100%-3rem-41px)] sm:h-[calc(100%-4rem-41px)]'>
                        <LineChart />
                    </div>
                </div>
            </section>
        </section>
    );
};

const PersonalizeInsight = () => {
    return (
        <ErrorBoundary>
            <PersonalizeInsightContent />
        </ErrorBoundary>
    );
};

export default withErrorBoundary(PersonalizeInsight);
