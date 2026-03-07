import { onCLS, onINP, onLCP } from 'web-vitals';
import type { CLSMetric, INPMetric, LCPMetric } from 'web-vitals';

const addWebVitalsReporting = () => {
    const logToConsole = ({ name, id, delta, rating }: CLSMetric | INPMetric | LCPMetric) => {
        console.log(`${name} matching ID ${id} changed by ${String(delta)} and the rating is ${rating}`);
    };

    onCLS(logToConsole);
    onINP(logToConsole);
    onLCP(logToConsole);
};

export { addWebVitalsReporting };
