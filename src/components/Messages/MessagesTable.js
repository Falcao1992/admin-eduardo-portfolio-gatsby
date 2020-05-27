import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    Checkbox,
    IconButton,
    Tooltip,
    FormControlLabel,
    Switch
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SendIcon from '@material-ui/icons/Send';


import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import styled from "styled-components";

import moment from "moment";
import 'moment/locale/fr';
import app from "../../firebase";

moment.locale('fr');
toast.configure();


const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

const headCells = [
    {id: 'name', numeric: false, disablePadding: true, label: 'Nom de Famille'},
    {id: 'firstName', numeric: false, disablePadding: false, label: 'Prénom'},
    {id: 'message', numeric: false, disablePadding: false, label: 'Message'},
    {id: 'phoneNumber', numeric: true, disablePadding: false, label: 'N° de Téléphone'},
    {id: 'email', numeric: false, disablePadding: false, label: 'Email'},
    {id: 'dateMessage', numeric: false, disablePadding: false, label: 'Date du Message'},
    {id: 'read', numeric: false, disablePadding: false, label: 'Lu'},
];

const EnhancedTableHead = (props) => {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHeadStyled>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{'aria-label': 'select all messages'}}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHeadStyled>
    );
};

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = ({numSelected, messagesSelected, setIsDeletedMessages}) => {
    const classes = useToolbarStyles();

    const deleteMessageSelected = () => {
        messagesSelected.forEach(key => {
            app.database().ref(`/contactMessage/${key}`).remove().then(() => {
                toast.success(`Le message à été correctement supprimé !!!`, {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                setIsDeletedMessages(true);
            });
        })
    };

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} sélectionné
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Messages
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={deleteMessageSelected}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export const MessagesTables = ({dataMessages, setIsDeletedMessages}) => {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const firebaseDataMessages = Object.values(dataMessages);



    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = firebaseDataMessages.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, key) => {
        const selectedIndex = selected.indexOf(key);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, key);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (key) => {
        return selected.indexOf(key) !== -1;
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, firebaseDataMessages.length - page * rowsPerPage);

    const limitCharsMessage = (msg) => {
        if(msg.length > 55) {
            return msg.substring(0,55) + " ...";
        } else {
            return msg
        }
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} messagesSelected={selected} setIsDeletedMessages={setIsDeletedMessages}/>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={firebaseDataMessages.length}
                        />
                        <TableBody>
                            {stableSort(firebaseDataMessages, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((message, index) => {
                                    const isItemSelected = isSelected(message.key);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRowStyled
                                            hover
                                            onClick={(event) => handleClick(event, message.key)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={index}
                                            selected={isItemSelected}
                                            isread={message.read === "false" ? "false" : "true"}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </TableCell>

                                            <TableCell component="th" id={labelId} scope="row">
                                                {message.name}
                                            </TableCell>

                                            <TableCell align="right">{message.firstName}</TableCell>

                                            <TableCell align="right">
                                                <Link to={{
                                                    pathname: `/message/${message.name.toLowerCase()}`,
                                                    state: {message}
                                                }}>
                                                    <IconButton aria-label="Mail icon">
                                                        <MailIcon fontSize="small"/>
                                                    </IconButton>
                                                    {limitCharsMessage(message.message)}
                                                </Link>
                                            </TableCell>

                                            <TableCell align="right">
                                                <a href={`tel:${message.phoneNumber}`}>
                                                    <IconButton aria-label="Phone icon">
                                                        <PhoneIcon fontSize="small"/>
                                                    </IconButton>
                                                    {message.phoneNumber}
                                                </a>
                                            </TableCell>

                                            <TableCell align="right">
                                                <a href={`mailto:${message.mail}`}>
                                                    <IconButton aria-label="Send icon">
                                                        <SendIcon fontSize="small"/>
                                                    </IconButton>
                                                    {message.mail}
                                                </a>
                                            </TableCell>

                                            <TableCell align="right" className="dateClassCell">
                                                <ContainerCellTimeAgo>
                                                    <IconButton aria-label="Schedule icon">
                                                        <ScheduleIcon fontSize="small"/>
                                                    </IconButton>
                                                    {moment(message.dateMessage).fromNow()}
                                                </ContainerCellTimeAgo>
                                            </TableCell>
                                            <TableCell align="right">{message.read}</TableCell>
                                        </TableRowStyled>


                                    );

                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={firebaseDataMessages.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                label="Dense padding"
            />
        </div>
    );
};

const TableHeadStyled = styled(TableHead)`
    background-color: ${props => props.theme.colors.primary};
`;

const ContainerCellTimeAgo = styled.div`
    width: max-content;
`;

const TableRowStyled = styled(TableRow)`
    td,th, a {
        font-weight: ${props => props.isread === "false" && "bold"};
        color: ${props => props.isread === "false" ? props.theme.colors.secondary : "initial"};
        font-size: ${props => props.isread === "false" ? "1rem" : "0.8rem"};
        width: max-content;
    }
    a {
        display: flex;
        align-items: center;
    }
    `;
