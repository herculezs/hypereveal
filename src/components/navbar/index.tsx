import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Link from 'next/link'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Typography from '@mui/material/Typography'

const Navbar = () => {
    return (
        <Box sx={{ backgroundColor: '#ffffff', height: 64 }}>
            <Container sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Typography variant="h5" component="div" sx={{ marginRight: '40px' }}>
                    HypeReveal
                </Typography>
                <Box sx={{ flex: 1, '&:hover': { color: 'primary.main' } }}>
                    <Link href="/">Analytics</Link>
                </Box>
                <Link href="/">
                    <AccountCircleIcon sx={{ fontSize: 30 }} />
                </Link>
            </Container>
        </Box>
    )
}

export default Navbar
