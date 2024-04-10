from flask import Flask, render_template, request
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
    def __init__(self, fname, lname, email, password):
        self.fname = fname
        self.lname = lname
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

def signup_user(first_name, last_name, email, password):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('INSERT INTO t_users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', (first_name, last_name, email, password))
    connection.commit()
    connection.close()

def login(username, password):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM t_users WHERE username = ? AND password = ?', (username, password))
    user = cursor.fetchone()
    connection.close()
    if user:
        return User(*user)
    return None

def get_json_data(objects_list):
    object_dicts = [obj.__dict__ for obj in objects_list]
    json_data = json.dumps(object_dicts)
    return json_data

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    gym_products = get_products('gym')
    yoga_products = get_products('yoga')
    supplements_products = get_products('supplements')
    return render_template('index.html', gym_products=get_json_data(gym_products), yoga_products=get_json_data(yoga_products), supplements_products=get_json_data(supplements_products))

@app.route('/aboutus', methods=['GET'])
def aboutus():
    return render_template('html/aboutus.html')

@app.route('/products', methods=['GET'])
def products():
    products = get_products()
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

@app.route('/signup', methods=['POST'])
def user_signup():
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        email = request.form.get('email')
        password = request.form.get('password')
        signup_user(first_name, last_name, email, password)
        # return redirect(url_for('index'))
        return 'User signed up successfully'

@app.route('/login', methods=['POST'])
def user_login():
    username = request.form.get('username')
    password = request.form.get('password')
    user = login(username, password)
    if user:
        return 'Login successful'
    return 'Invalid credentials', 401

if __name__ == '__main__':
    cart = Cart()
    app.run(debug=True)