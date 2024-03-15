import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';

export const OverviewProgress = ({ onboardingProgress, sx, configure }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [stepCompletion, setStepCompletion] = useState({});
    const totalSteps = 6; // Total number of steps including the new factor

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        // Calculate completion for each step based on provided progress data
        const progressData = onboardingProgress;
        const stepCompletionData = {};

        // Initialize stepCompletionData with default values
        const defaultCompletion = {
            configureAccount: false,
            configureIntegrations: false,
            shopifyImport: false,
            autopricingConfiguration: false,
            posConfiguration: false,
            otherTask: false, // New factor
        };

        // Update stepCompletionData based on provided progress data
        for (const key in progressData) {
            if (progressData.hasOwnProperty(key)) {
                stepCompletionData[key] = progressData[key];
            }
        }

        // Set step completion state
        setStepCompletion(stepCompletionData);
    }, [onboardingProgress]);

    const handleItemClick = (factor) => {
        // Pass the clicked factor to the configure function
        configure(factor);
    };

    const renderProgressIndicators = () => {
        const progressFactors = [
            { key: 'configureAccount', label: 'Configure Account' },
            { key: 'configureIntegrations', label: 'Configure Integrations' },
            { key: 'shopifyImport', label: 'Shopify Setup' },
            { key: 'autopricingConfiguration', label: 'Autopricing Configuration' },
            { key: 'posConfiguration', label: 'POS Configuration' },
            { key: 'otherTask', label: 'Other Task' }, // New factor
        ];

        let completedTasks = 0;

        return progressFactors.map((factor) => {
            const isCompleted = stepCompletion[factor.key];

            if (isCompleted) {
                completedTasks++;
            }

            return (
                <Tooltip title={`Click to open ${factor.label}`} arrow key={factor.key}>
                    <ListItem button onClick={() => handleItemClick(factor.key)}>
                        <ListItemText
                            primary={factor.label}
                            primaryTypographyProps={{ variant: 'subtitle1', color: isCompleted ? 'primary' : 'error' }}
                            secondary={isCompleted ? 'Completed' : 'Pending'}
                            secondaryTypographyProps={{ variant: 'body2', color: isCompleted ? 'primary' : 'error' }}
                        />
                    </ListItem>
                </Tooltip>
            );
        });
    };

    const completedTasks = Object.values(stepCompletion).filter((completed) => completed).length;
    const remainingTasks = totalSteps - completedTasks;

    return (
        <Card sx={sx}>
            <CardHeader title="Onboarding Progress" />

            <List>
                {isLoading ? (
                    <ListItem>
                        <Typography variant="body2">Loading...</Typography>
                    </ListItem>
                ) : (
                    <>
                        <ListItem>
                            <Typography variant="body2">
                                Completed Tasks: {completedTasks}/{totalSteps}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body2">
                                Remaining Tasks: {remainingTasks}/{totalSteps}
                            </Typography>
                        </ListItem>
                        {/* Render progress indicators for each factor */}
                        {renderProgressIndicators()}
                    </>
                )}
            </List>
        </Card>
    );
};

OverviewProgress.propTypes = {
    onboardingProgress: PropTypes.object.isRequired, // Update prop type for onboarding progress
    sx: PropTypes.object,
    configure: PropTypes.func.isRequired, // Add prop type for configure function
};
