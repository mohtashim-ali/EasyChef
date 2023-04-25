import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () =>  {
  return (
    <>
    <Form>
      <InputGroup className="mb-4">
        <FormControl
          type="search"
          placeholder="Pasta, Pizza, ..."
          className="border-0 bg-light shadow"
          aria-describedby="button-addon1"
        />
                  <Button variant="link" className="text-primary" type="submit" id="button-addon1">
            <FaSearch style={{fontSize: "24px"}}/>
          </Button>
      </InputGroup>
    </Form>
    </>
  );
}

export default SearchBar;