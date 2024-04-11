from flask import Flask, render_template, request, jsonify
import sqlite3
import json
import os

# Get the directory of the current Python script
current_directory = os.path.dirname(os.path.abspath(__file__))

# Specify the relative path to the SQLite database file
database_relative_path = 'database/nutrimet_db.db'
database_file = os.path.join(current_directory, database_relative_path)

products = []

class Product:
    def __init__(self, productid, productname, productdetail, originalprice, discountPrice, isondiscount, imageURL, rating, totalquantity, category):
        self.productid = productid
        self.productname = productname
        self.productdetail = productdetail
        self.originalprice = originalprice
        self.discountPrice = discountPrice
        self.isondiscount = isondiscount
        self.imageURL = imageURL
        self.rating = rating
        self.totalquantity = totalquantity
        self.category = category
class User:
    def __init__(self, first_name, last_name, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password

class Cart:
    def __init__(self):
        self.items = []

    def add_to_cart(self, product):
        self.items.append(product)

    def remove_from_cart(self, product):
        self.items.remove(product)

    def get_cart_total(self):
        return sum([item.discountPrice for item in self.items])

def get_products(category):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM t_products WHERE c_category = ?', (category,))
    rows = cursor.fetchall()
    connection.close()
    products = [Product(*row) for row in rows]
    return products

def get_product_by_id(product_id):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM t_products WHERE productid = ?', (product_id,))
    row = cursor.fetchone()
    connection.close()
    if row:
        return Product(*row)
    return None

def user_signup(user):
    try:
        connection = sqlite3.connect(database_file)
        cursor = connection.cursor()
        cursor.execute('INSERT INTO t_users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                    (user.first_name, user.last_name, user.email, user.password))
        connection.commit()
        connection.close()
        return True
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return False

def user_login(user_input_email, user_input_password):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('SELECT email, password FROM t_users WHERE email = ?', (user_input_email,))
    user = cursor.fetchone()
    connection.close()

    user_exists = False
    correct_password = False
    message = ""

    if user:
        user_exists = True
        if user[1] == user_input_password:
            correct_password = True
            message = "Login successful."
        else:
            message = "Incorrect password."
    else:
        message = "User does not exist."

    return user_exists, correct_password, message

def get_json_data(objects_list):
    object_dicts = [obj.__dict__ for obj in objects_list]
    json_data = json.dumps(object_dicts)
    return json_data

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    gym_products = get_products('gym')
    yoga_products = get_products('yoga')
    supplements_products = get_products('sup')
    return render_template('index.html', gym_products=get_json_data(gym_products), yoga_products=get_json_data(yoga_products), supplements_products=get_json_data(supplements_products))

@app.route('/aboutus', methods=['GET'])
def aboutus():
    return render_template('/html/aboutus.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        # Render the signup page
        return render_template('/html/signup.html')
    elif request.method == 'POST':
        request_type = request.headers.get('X-Request-Type')
        data = request.json
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        if request_type == 'signup':
            new_user = User(first_name=first_name, last_name=last_name, email=email, password=password)
            signup_success = user_signup(new_user)
            return jsonify({'signup_success': signup_success})
        else:
            user_exists, correct_password, message = user_login(email, password)
            response = {'user_exists': user_exists, 'correct_password': correct_password, 'message': message}
            return jsonify(response)

@app.route('/products', methods=['GET'])
def products():
    # products = get_products()
    return render_template('html/products.html', products=products)

@app.route('/product/<product_id>', methods=['GET'])
def product_detail(product_id):
    product = get_product_by_id(product_id)
    if product:
        return render_template('product_detail.html', product=product)
    return 'Product not found', 404

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    product_id = request.form.get('product_id')
    product = get_product_by_id(product_id)
    if product:
        cart.add_to_cart(product)
        return 'Product added to cart successfully'
    return 'Product not found', 404

if __name__ == '__main__':
    cart = Cart()
    app.run(debug=True)