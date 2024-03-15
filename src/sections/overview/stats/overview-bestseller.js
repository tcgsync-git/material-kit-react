import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';

export const OverviewBestSeller = ({ products = [], announcements, sx }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <Card sx={sx}>
            <CardHeader title="Notifications" />

            <List>
                <ListItem>
                    <strong className="text-muted">News: </strong><Typography variant="body2">{announcements.message}</Typography>
                </ListItem>

                {isLoading ? (
                    <ListItem>
                        <Typography variant="body2">Loading...</Typography>
                    </ListItem>
                ) : products.length === 0 ? (
                    <ListItem>
                        {/* <Typography variant="body2">No new Notifications.</Typography> */}
                    </ListItem>
                ) : (
                    products.map((product, index) => {
                        const hasDivider = index < products.length - 1;

                        return (
                            <ListItem divider={hasDivider} key={product.productId}>
                                <ListItemAvatar>
                                    <Box
                                        component="img"
                                        src={product.image}
                                        alt={product.enName}
                                        sx={{
                                            borderRadius: 1,
                                            height: 48,
                                            width: 48,
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={product.enName}
                                    primaryTypographyProps={{ variant: 'subtitle1' }}
                                    secondary={`Sales: ${product.sales}`}
                                    secondaryTypographyProps={{ variant: 'body2' }}
                                />

                            </ListItem>
                        );
                    })
                )}
            </List>
            <Divider />
            {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Tooltip title="View all products">
                    <Button
                        color="inherit"
                        endIcon={<ArrowRightIcon />}
                        size="small"
                        variant="text"
                        href="/inventory/" // Added: Set the href to the desired URL
                    >
                        View all
                    </Button>

                </Tooltip>
            </CardActions> */}
        </Card>
    );
};

OverviewBestSeller.propTypes = {
    products: PropTypes.array,
    announcements: PropTypes.object, // New prop for announcements
    sx: PropTypes.object,
};
