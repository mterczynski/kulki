# !. (manual) npm i; npm run build; add "./" to import paths in index.html // todo - make it automatic

# 2. Update build in ../mterczynski.github.io
rm -rf ../mterczynski.github.io/kulki
mkdir ../mterczynski.github.io/kulki
cp -r ./dist/* ../mterczynski.github.io/kulki/
cd ../mterczynski.github.io/kulki

# 3. Commit in ../mterczynski.github.io
git add .
git commit -a -m "Update kulki build"

# 4. Push in ../mterczynski.github.io
git push
