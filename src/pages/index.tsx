import {
  Box,
  Container,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TableFooter,
  Paper,
  Link
} from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { visuallyHidden } from '@mui/utils'
import GradeIcon from '@mui/icons-material/Grade'
import styles from '../styles/Home.module.css'

interface TableHeadCell {
  id: string
  label: string,
  sortable?: boolean
}

type Order = 'asc' | 'desc'

const headCells: readonly TableHeadCell[] = [
  {
    id: 'rank',
    label: 'Rank',
  },
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'website',
    label: 'Website',
    sortable: true
  },
  {
    id: 'domain_authority',
    label: 'Domain Authority',
    sortable: true
  },
  {
    id: 'page_authority',
    label: 'Page Authority',
    sortable: true
  },
]

const Home: NextPage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [collections, setCollections] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [orderBy, setOrderBy] = useState('domain_authority');
  const [order, setOrder] = useState<Order>('desc');

  const fetchCollections = useCallback(async () => {
    const offset = page * rowsPerPage
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections?limit=${rowsPerPage}&offset=${offset}&sort=${orderBy}&order=${order}`).then(res => res.json())
    setCollections(resp.collections)
    setTotalCount(resp.total_count)
  }, [page, rowsPerPage, order, orderBy])

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleRequestSort = (
    id: string
  ) => {
    const isAsc = orderBy === id && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(id)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    fetchCollections()
  }, [page, rowsPerPage, order, orderBy])

  return (
    <Container>
      <Head>
        <title>Home | HypeReveal</title>
        <meta name="description" content="This is a HypeReveal dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ padding: '40px 0' }}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: '10px' }}>
          Top Collections
        </Typography>
        <Typography variant="subtitle1" component="p">
          Top collections by marketcap and other key indicators.
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: '50px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align="left"
                    padding="normal"
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.sortable && (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    )}
                    {!headCell.sortable && headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {collections.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>
                    {row.rank}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ position: 'relative', paddingLeft: '50px' }}>
                      {row.logo && <img className={styles.TableLogo} src={row.logo} />}
                      <Box component="span">
                        {row.name}
                      </Box>
                      {row.popular && (
                        <GradeIcon color="primary" sx={{ marginLeft: '10px', position: 'relative', top: '5px' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {row.website && (
                      <Link href={row.website.startsWith('http') ? row.website : `http://${row.website}`} target="_blank" rel="noopener">{row.website}</Link>
                    )}
                    {!row.website && '-'}
                  </TableCell>
                  <TableCell>
                    {row.domain_authority ?? '-'}
                  </TableCell>
                  <TableCell>
                    {row.page_authority ?? '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20, 50]}
                  colSpan={5}
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}

export default Home
