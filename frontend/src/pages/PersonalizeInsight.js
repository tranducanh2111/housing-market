// src/pages/PersonalizeInsight.js
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from 'components/ultility/ErrorBoundary';
import withErrorBoundary from 'hoc/withErrorBoundary';
import PredictionResult from 'components/PredictionResult';

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
            navigate('/');
            return;
        }
        setResult(JSON.parse(storedResult));
    }, [navigate]);

    if (!result) return null;

    const selectedState = result.result['property-details'].state;
    const selectedCity = result.result['property-details'].city;

    return (
        <section className="mx-auto max-w-[1920px] w-full flex flex-col gap-8 px-5 mb-10">
            <section className="grid grid-cols-1 md:grid-cols-[270px_1fr] gap-8">
                <PredictionResult result={result} />
                <div className="bg-white rounded-lg shadow-md p-4 h-[500px]">
                    <h3 className="text-h3-sm sm:text-h3 font-semibold mb-4">Property Cost in Different States</h3>
                    <div className='h-[calc(100%-2.5rem)] sm:h-[calc(100%-3rem)]'>
                        <Choropleth 
                            data={result.result['choropleth-chart-data']} 
                            selectedState={selectedState}
                        />
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex-1 min-w-[290px] bg-white rounded-lg shadow-md p-4 h-[540px]">
                    <h3 className="text-h3-sm sm:text-h3 font-semibold mb-4">{`Property Cost in Different Cities of ${selectedState}`}</h3>
                    <div className='h-[calc(100%-3rem-41px)] sm:h-[calc(100%-4rem-41px)]'>
                        <BarChart
                            data={result.result['bar-chart-data']}
                            selectedCity={selectedCity}
                        />
                    </div>
                </div>
                <div className="flex-1 min-w-[290px] bg-white rounded-lg shadow-md p-4 h-[540px]">
                    <h3 className="text-h3-sm sm:text-h3 font-semibold mb-4">Area Impact</h3>
                    <div className='h-[calc(100%-3rem-41px)] sm:h-[calc(100%-4rem-41px)]'>
                        <LineChart
                            livingAreaData={result.result['line-chart-data']['living-area-prices']}
                            landAreaData={result.result['line-chart-data']['land-area-prices']}
                            predictionResult={result.result}
                        />
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
